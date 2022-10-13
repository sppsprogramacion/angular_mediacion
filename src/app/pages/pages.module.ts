import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CiudadanosComponent } from './ciudadanos/ciudadanos.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TableModule,
    TabViewModule,//funciona ng-template
    InputTextareaModule,
    ToolbarModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    CiudadanosComponent
  ],
  
})
export class PagesModule { }
