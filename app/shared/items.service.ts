import { Injectable } from '@angular/core';
import { DialogComponent } from '../redactor/dialog/dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreationNemItemComponent } from '../redactor/creation-nem-item/creation-nem-item.component';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(public dialog: MatDialog, private snackBar: MatSnackBar) { }

  columns = new BehaviorSubject<any>([]);
  items = new BehaviorSubject<any>([]);

  getItems(): Observable<any> {
    return this.items.asObservable();
  }

  getColumns(): Observable<any> {
    return this.columns.asObservable();
  }

  setItems(items: object[]): void {
    this.items.next(items);
  }

  setCols(cols: any): void {
    this.columns.next(cols);
  }

  unload(items: object[], columns: string[]) {
    const unloadData: string[] = [];
    let elem: string[] = [];

    if (typeof items !== 'undefined') {
      items.forEach(element => {
        columns.forEach(col => {
            elem.push(`${col}:"${element[col]}"`);
        });
        unloadData.push('{' + elem.join(',') + '}') ;
        elem = [];
      });
      return `[${unloadData.join(',')}]`;
    }
  }

  addItem(items: object[]): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = items[0];
    this.dialog.open(CreationNemItemComponent, dialogConfig).afterClosed().subscribe(result => {
      const error = Object.values(result).some( value => (value === '' || value === ' '));
      if (result !== '' && !error) {
        items.push(result);
        this.setItems(items);
      } else {
        this.openSnackBar('Input correct item.');
      }
    });
  }

  deleteItem(items: object[], item: object): void {
    let index: number;

    items.forEach(element => {
      if (JSON.stringify(element) === JSON.stringify(item)) {
          index = items.indexOf(element);
      }
    });

    items.splice(index, 1);
    this.setItems(items);
    this.openSnackBar('Deleted.');
  }

  openSnackBar(mes: string) {
    this.snackBar.open(mes, 'OK', {
      duration: 2500,
    });
  }

  changeItem(items: object[], item: object, col: string): void {
    items.forEach(element => {
      if (JSON.stringify(element) === JSON.stringify(item)) {
        this.dialog.open(DialogComponent, { disableClose : true}).afterClosed().subscribe(result => {
          if (typeof result !== 'undefined' && result !== '') {
            element[col] = result;
          }
        });
      }
    });
  }
}
