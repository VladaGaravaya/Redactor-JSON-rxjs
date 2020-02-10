import { Component, OnInit } from '@angular/core';
import { ItemsService } from '../shared/items.service';
import { ValidationService } from './validation.service';

@Component({
  selector: 'app-input',
  templateUrl: 'input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  constructor(private itemsService: ItemsService, private validationService: ValidationService) { }

  data = '';
  routerLink = '/redactor';

  ngOnInit() {
    this.itemsService.getItems().subscribe(items => {this.data = this.unload(items); });
  }

  unload(items: object[]) {
    const unloadData: string[] = [];
    let elem: string[] = [];

    if ( items.length !== 0) {
      const columns = Object.keys(items[0]);
      items.forEach(element => {
        columns.forEach(col => {
            elem.push(`${col}:"${element[col]}"`);
        });
        unloadData.push('{' + elem.join(',') + '}') ;
        elem = [];
      });
      return `[${unloadData.join(',')}]`;
    } else {
      return '';
    }
  }

  loading(data: string) {
    if (this.validationService.validate(data)) {
        this.routerLink = '/redactor';
        this.itemsService.setItems(this.validationService.items);
        this.itemsService.setCols(this.validationService.col);
    } else {
      this.itemsService.openSnackBar('Input correct JSON.');
      this.routerLink = '/';
    }
  }

  read() {
    const file = (document.getElementById('file') as HTMLInputElement).files[0];
    if ( typeof file !== 'undefined') {
      if (file.size >= 256 * 1024) {
        if (!confirm('File size is ' + Math.round(file.size / 1024) + 'kBytes! Really want to read it?')) {
          return;
        }
      }
      const reader = new FileReader();
      reader.onload = () => {

        this.loading((reader.result).toString());
        this.data = (reader.result).toString().replace(/\r?\n/g, '');

      };
      reader.readAsText(file);
    }
  }
}
