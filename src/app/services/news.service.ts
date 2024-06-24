import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Article, ArticlesByCategoryAndPage, NewsResponse } from '../interfaces';
import { Observable, of } from 'rxjs';
import { map } from "rxjs/operators";

const apiKey = environment.apiKey;
const apiUrl = environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private articlesByCategoryAndPage: ArticlesByCategoryAndPage = {}

  constructor( private http:HttpClient) { }

  private executeQuery<T>( endpoint: string ){
    console.log('Petición HTTP realizada');
    return this.http.get<T>(`${ apiUrl }${ endpoint }`, {
      params: {
        apiKey: apiKey,
        country: 'us'
      }
    });
    
  }

  getToHeadLines():Observable<Article[]> {
    // return this.http.get<NewsResponse>(`${apiUrl}/v2/top-headlines?country=us`, {
    //   params: {
    //     apiKey: apiKey // Se puede omitir la asignación por llamarse igual
    //   }
    // }).pipe(
    //   map (data => data.articles)
    // );
    // return this.getArticlesByCategory('business');
    return this.executeQuery<NewsResponse>(`/v2/top-headlines?category=business`)
        .pipe(
          map ( ({articles}) => articles)
        );
  }

  getTopHeadLinesByCategory(category: string, loadMore: boolean = false):Observable<Article[]>{
    // return this.http.get<NewsResponse>(`${apiUrl}/v2/top-headlines?country=us`, {
    //   params: {
    //     apiKey: apiKey,
    //     category: category
    //   }
    // }).pipe(
    //   map (data => data.articles)
    // );

    // Si el loadMore viene true va a cargar más artículos
    if(loadMore){
      this.getArticlesByCategory(category);
    }

    // si el objeto articlesByCategoryAndPage no está vacío, devuelve esto
    if(this.articlesByCategoryAndPage[category]){
      return of(this.articlesByCategoryAndPage[category].articles);
    }

    // si no se cumple ninguna condición, entra al método
    return this.getArticlesByCategory(category);

  }

  private getArticlesByCategory(category: string): Observable<Article[]>{
    
    if (Object.keys (this.articlesByCategoryAndPage).includes(category) ){
      // this.articlesByCategoryAndPage[category].page += 1;
    } else {
      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: []
      }
    }

    const page = this.articlesByCategoryAndPage[category].page + 1;

    return this.executeQuery<NewsResponse>(`/v2/top-headlines?category=${ category }&page=${page}`)
        .pipe(
          map( ({articles})=> {

            if (articles.length === 0) {
              return this.articlesByCategoryAndPage[category].articles;
            }

            this.articlesByCategoryAndPage[category] = {
              page: page,
              articles: [ ...this.articlesByCategoryAndPage[category].articles, ...articles ]
            }

            return this.articlesByCategoryAndPage[category].articles;
          })
        );
  }
}
