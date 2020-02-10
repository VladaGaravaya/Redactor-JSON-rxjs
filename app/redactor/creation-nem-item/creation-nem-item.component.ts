import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-creation-nem-item',
  templateUrl: './creation-nem-item.component.html'
})
export class CreationNemItemComponent {

  item: object = {};
  columns: string[];

  constructor(public dialogRef: MatDialogRef<CreationNemItemComponent>, @Inject(MAT_DIALOG_DATA) data: object) {
    this.createNewItem(data);
  }

  createNewItem(data: object) {
    this.columns = Object.keys(data);
    this.columns.forEach( col => {
      this.item[col] = '';
    });
  }
}

