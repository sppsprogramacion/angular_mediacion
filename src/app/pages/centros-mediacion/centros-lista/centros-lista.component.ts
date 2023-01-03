import { Component, OnInit } from '@angular/core';
import { CentrosMediacionService } from '../../../service/centros-mediacion.service';
import { CentroMediacionModel } from '../../../models/centro_mediacion.model';

@Component({
  selector: 'app-centros-lista',
  templateUrl: './centros-lista.component.html',
  styleUrls: ['./centros-lista.component.scss']
})
export class CentrosListaComponent implements OnInit {
  loading:boolean = true;

  //LISTAS    
  listCentrosMediacion: CentroMediacionModel[]=[];

  constructor(
    private centrosMediacionService: CentrosMediacionService,
  ) { }

  ngOnInit(): void {
    this.listarCentrosMediacion()
  }

  
  //LISTADO DE CIUDADANOS
  listarCentrosMediacion(){    
    this.centrosMediacionService.listarCentroMediacionTodos().
        subscribe(respuesta => {
        this.listCentrosMediacion= respuesta[0];
        console.log("lista centros mediacion",this.listCentrosMediacion);
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE CIUDADANOS.......................................................

}
