import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {SettingsService} from "../../services/settings.service";
import {BehaviorSubject, Observable, of, take} from "rxjs";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})

export class SettingsComponent implements OnInit, AfterContentInit{

  page: Observable<number>
  lastPage: Observable<number>
  current: number
  last: number
  upToDate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)

  constructor(private api: SettingsService, private detector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.lastPage=this.api.getLastPage()
    this.page=this.api.getCurrentPage()
  }

  ngAfterContentInit(): void {
    this.subscribeCurrentAndLast()
    this.acceptRefresh(false)
  }

  swapPage(page: number){
    this.subscribeCurrentAndLast()
    if(page !==this.current){
      this.page=of(page)
      this.upToDate= new BehaviorSubject<boolean>(false)
      this.api.setCurrentPage(page).subscribe(_=>{
        take(1)
        this.upToDate= new BehaviorSubject<boolean>(true)
      })
    }
    //this.acceptRefresh(true)
  }

  swapCustomPage(){
    let input: string =(<HTMLInputElement>document.getElementById('select-page')).value
    let page = parseInt(input)
    if(page >= this.last){
      page=this.last
    }
    if(page < 1){
      page=this.current
    }
    this.swapPage(page)
  }

  swapRequestedPage(page: number){
    if(this.current!=1){
      this.swapPage(page)
      this.optimizePageSwapPanel()
    }
  }

  setUpToDate(is: boolean){
    this.upToDate.next(is)
    this.detector.detectChanges()
  }

  acceptRefresh(accept: boolean){
    console.log('accept: ' + accept)
    if(accept){
      this.lastPage=this.api.getLastPage()
      console.log('triggered refresh panel: ')
      console.log('last: '+this.last)
      this.subscribeCurrentAndLast()
      this.optimizePageSwapPanel()
    }
  }

  private optimizePageSwapPanel(){
    //this.subscribeCurrentAndLast()
    if(this.last===1 || this.last ===undefined){
      SettingsComponent.changeVisibility('swap-page-last')
      SettingsComponent.changeVisibility('swap-page-1')
    }
    if((this.last >1) && (this.last <=6)){
      let button_name: string
      for(let i = 2; i<=this.last; i++){
        button_name='swap-page-' + String(i)
        SettingsComponent.changeVisibility(button_name)
        if(this.last ===6){
          SettingsComponent.changeVisibility('swap-page-6')
        }
      }
    }
    if(this.last>6){
      let button_name: string
      for(let i = 2; i<=5; i++){
        button_name='swap-page-'+String(i)
        SettingsComponent.changeVisibility(button_name)
      }
      SettingsComponent.changeVisibility('dots')
      SettingsComponent.changeVisibility('swap-page-selected')
      SettingsComponent.changeVisibility('swap-page-last')
    }
  }

  private subscribeCurrentAndLast(){
    this.page.subscribe(c=>{
      this.current=c
      this.lastPage.subscribe(last=>{
        this.last=last
        this.optimizePageSwapPanel()
      })
    })
  }

  private static changeVisibility(name: string){
    // @ts-ignore
    document.getElementById(name).style.visibility="visible"
    // @ts-ignore
    document.getElementById(name).style.display="inline"
  }

}

