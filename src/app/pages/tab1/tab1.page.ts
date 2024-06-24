import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Article } from 'src/app/interfaces';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;

  public articles: Article[] = [];

  constructor( private newsService: NewsService) {}

  ngOnInit(): void {
    
    this.newsService.getToHeadLines()
      .subscribe( articles => {
        console.log(articles);
        this.articles.push( ...articles );
      });
  }

  // loadData( event: any ){
  //   this.newsService.getTopHeadLinesByCategory ('business', true )
  //       .subscribe( articles => {

  //         if ( articles.length === this.articles.length){
  //           // event.target.disabled = true;
  //           this.infiniteScroll.disabled = true;
  //           return;
  //         }

  //         this.articles = articles;
  //         setTimeout(() => {
  //           // event.target.complete();
  //           this.infiniteScroll.complete();
  //         }, 1000);
  //       })
  // }

}
