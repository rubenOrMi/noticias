import { Component, Input } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Article } from 'src/app/interfaces';
import { Share } from "@capacitor/share";
import { Browser } from "@capacitor/browser";
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent  {

  @Input() article: Article;
  @Input() index: number;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private storageService: StorageService) { }

  openArticle(){
    window.open()
  }

  async onOpenMenu(){

    const articleInFavorite = this.storageService.articleInFavorite(this.article);

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons:[
        {
          text: 'Compartir',
          icon: 'share-outline',
          handler: () => {
            this.onShareArticle()
          }
        },
        {
          text: articleInFavorite ? 'Remover favorito' : 'Favorito',
          icon: articleInFavorite ? 'heart' : 'heart-outline',
          handler: () => {
            this.onToogleFavorite()
          }
        },
        {
          text: 'Cancelar',
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();

  }

  async openBrowser(){
    return await Browser.open({ url: this.article.url })
  }

  onToogleFavorite(){
    this.storageService.saveRevomeArticle(this.article);
  }

  private async onShareArticle() {
    return await Share.share({
      title: this.article.title,
      text: this.article.description,
      url: this.article.url,
      dialogTitle: this.article.source.name
    })
  }

}
