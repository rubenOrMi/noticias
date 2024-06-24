import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Article } from 'src/app/interfaces';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;

  categories: string[] = ['business','entertainment','general','health','science','sports','technology'];
  selectedCategory: string = this.categories[0];
  articles: Article[] = [];

  constructor( private newsService: NewsService) {}

  segmentChanged(event: any){
    this.selectedCategory = event.detail.value;
    this.getNewsByCategory();
  }

  ngOnInit(): void {
      this.getNewsByCategory();
  }

  getNewsByCategory(){
    this.newsService.getTopHeadLinesByCategory(this.selectedCategory)
          .subscribe( articles => {
            console.log(articles);
            this.articles = articles;
          });
  }

  loadData( event: any ){
    this.newsService.getTopHeadLinesByCategory (this.selectedCategory, true )
        .subscribe( articles => {

          if ( articles.length === this.articles.length){
            // event.target.disabled = true;
            this.infiniteScroll.disabled = true;
            return;
          }

          this.articles = articles;
          setTimeout(() => {
            // event.target.complete();
            this.infiniteScroll.complete();
          }, 1000);
        })
  }

}
