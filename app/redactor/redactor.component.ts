import { Component,  OnDestroy } from '@angular/core';
import { ItemsService } from '../shared/items.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-redactor',
  templateUrl: 'redactor.component.html',
  styleUrls: ['./redactor.component.css']
})
export class RedactorComponent {

  items: any;
  columns: string[];

  constructor(private itemsService: ItemsService) {
    this.itemsService.getColumns().subscribe(columns => {this.columns = columns; });
    this.itemsService.getItems().subscribe(items => {this.items = items; });
  }

  addItem(): void {
    this.itemsService.addItem(this.items);
  }

  deleteItem(item: object): void {
    this.itemsService.deleteItem(this.items, item);
  }

  changeItem(item: object, col: string): void {
    this.itemsService.changeItem(this.items, item, col);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }

  writeJSON(): void {
    const a = document.getElementsByTagName('a')[0];
    let data: string;
    data = this.itemsService.unload(this.items, this.columns);
    const csvData = 'data:application/txt;charset=utf-8,' + data;
    a.href = csvData;
    a.target = '_blank';
    a.download = 'data.json';
  }

  toCSV(): string {
    let csvString = this.columns.join(',') + '\r\n';
    let array = [];
    this.items.forEach( (item: object) => {
      this.columns.forEach(col => {
        array.push(item[col]);
      });
      csvString += (array.join(',') + '\r\n');
      array = [];
    });
    return csvString;
  }

  writeCSV(): void {
    const a = document.getElementsByTagName('a')[1];
    const csv = this.toCSV();
    const csvData = 'data:application/txt;charset=utf-8,' + csv;
    a.href = csvData;
    a.target = '_blank';
    a.download = 'data.csv';
  }
}
