import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private HttpClient: HttpClient) { }

  public loadNewses(): Observable<News[]>{
    return this.HttpClient.get<News[]>("http://localhost:8080/news/")
  }

  public publishNewsPost(news: News): Observable<any>{
    return this.HttpClient.post<any>("http://localhost:8080/news/publish/", news)
  }

  public deletePost(news: News): Observable<any>{
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        news_id: news.news_id,
        name: news.name,
        sourceURL: news.sourceURL,
        relevance_vote: news.relevance_vote,
        fake_vote: news.fake_vote,
        publishing_date: news.publishing_date,
        comments: news.comments
      }
    }
    return this.HttpClient.delete<News>("http://localhost:8080/news/delete/", options)
  }

  public sendRequestToIncreaseTruthVotesInDB(id: Number): Observable<any>{
    return this.HttpClient.put<any>('http://localhost:8080/votes/increase/truth/', id)
  }

  public sendRequestToIncreaseFakeVotesInDB(id: Number): Observable<News>{
    return this.HttpClient.put<any>('http://localhost:8080/votes/increase/fake/', id)
  }

  public publishComment(comment: Comment): Observable<number> {
    return this.HttpClient.post<number>("http://localhost:8080/comments/savenew/", comment)
  }

  public deleteComment(comment: Comment): Observable<any>{
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        comment_id: comment.comment_id,
        news_id: comment.news_id,
        commenter_name: comment.commenter_name,
        comment: comment.comment
      }
    }
    return this.HttpClient.delete<any>('http://localhost:8080/comments/delete/', options)
  }
}

export interface Comment {
  comment_id: number;
  news_id: number;
  commenter_name: string;
  comment: string;
}

export interface News {
  news_id: number;
  name: string;
  sourceURL: string;
  relevance_vote: number;
  fake_vote: number;
  publishing_date: Date;
  comments: Comment[];
}
