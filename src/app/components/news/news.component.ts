import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {Comment, News, NewsService} from "../../services/news.service";
import {BehaviorSubject, Observable, take} from "rxjs";


@Component({
  selector: 'news-table',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],

})
export class NewsComponent implements OnInit{

  newses: Observable<News[]>
  @Input() upToDate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  @Output() broadcastUpdate: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output() broadcastSwapPage: EventEmitter<number>= new EventEmitter<number>()
  @Output() broadcastRefreshPanel: EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor(private api: NewsService) {}

  ngOnInit(): void {
    this.newses = this.api.loadNewses()
  }



  createNewPost(){
    let news: News = NewsComponent.readNewPostForm()
    this.api.publishNewsPost(news).subscribe(_=>{
      this.broadcastSwapPage.emit(1)
      this.reloadNewses()
    })
    this.broadcastRefreshPanel.emit(true)
    NewsComponent.hideObject('new-post-form')
  }

  private static readNewPostForm(): News{
    return {
      news_id: 0,
      name: (<HTMLInputElement>document.getElementById('new-news-name')).value,
      sourceURL: (<HTMLInputElement>document.getElementById('new-news-sourceURL')).value,
      relevance_vote: 0,
      fake_vote: 0,
      publishing_date: (new Date),
      comments: []
    }
  }

  deletePost(news: News){
    this.api.deletePost(news).subscribe(_=>
      this.reloadNewses()
    )
    this.broadcastRefreshPanel.emit(true)
  }

  increaseTruthVotes(news: News){
    news.relevance_vote=news.relevance_vote+1
    this.api.sendRequestToIncreaseTruthVotesInDB(news.news_id).subscribe()
  }

  increaseFakeVotes(news: News){
    news.fake_vote=news.fake_vote+1
    this.api.sendRequestToIncreaseFakeVotesInDB(news.news_id).subscribe()
  }

  publishComment(news: News){
    let comment: Comment = NewsComponent.readComment(news)
    this.api.publishComment(comment).subscribe(_=>{
      take(1)
      this.reloadNewses()
    })
    this.broadcastRefreshPanel.emit(true)
    NewsComponent.hideObject('comment-form-'+news.news_id)
  }

  static readComment(news: News) : Comment{
    let id: number = news.news_id
    return {
      comment_id: 0,
      news_id: id,
      commenter_name: (<HTMLInputElement>document.getElementById("commenter-name-" + id)).value,
      comment: (<HTMLInputElement>document.getElementById("comment-text-" + id)).value
    }
  }

  deleteComment(news: News, comment: Comment){
    this.api.deleteComment(comment).subscribe(_=>
      this.reloadNewses()
    )
    this.broadcastRefreshPanel.emit(true)
  }

  displayOrHideObject(id: string){
    // @ts-ignore
    let visibility: string = document.getElementById(id).style.visibility.valueOf()
    if(visibility ==='hidden'){
      NewsComponent.displayObject(id)
    }
    else {
      NewsComponent.hideObject(id)
    }
  }

  reloadNewses(): void {
    this.newses=this.api.loadNewses()
  }

  private static displayObject(id: string){
    // @ts-ignore
    document.getElementById(id).style.visibility="visible"
    // @ts-ignore
    document.getElementById(id).style.display="inline"
  }

  private static hideObject(id: string){
    // @ts-ignore
    document.getElementById(id).style.visibility="hidden"
    // @ts-ignore
    document.getElementById(id).style.display="none"
  }

  /*ngOnChanges(changes: SimpleChanges): void {
    let is = false
    this.upToDate.subscribe(v=>{is=v})
    if (!is) {
      this.newses = this.upToDate.pipe(switchMap(_=> this.api.loadNewses()))
      this.broadcastUpdate.emit(true)
      //window.location.reload()
    }
  }*/

}
