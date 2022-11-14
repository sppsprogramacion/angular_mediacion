import { Component, OnInit } from '@angular/core';
import { CiudadanoModel } from 'src/app/models/ciudadano.model';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { CiudadanosService } from 'src/app/service/ciudadanos.service';

@Component({
  selector: 'app-usuarios-lista',
  templateUrl: './usuarios-lista.component.html',
  styleUrls: ['./usuarios-lista.component.scss']
})
export class UsuariosListaComponent implements OnInit {

  loading:boolean = true;

  //VARIABLES TRAMITE    
  ciudadano: CiudadanoModel;
  ciudadanoDialog: boolean;
  nuevoCiudadano: boolean;
  submitted: boolean;

  //LISTAS    
  listCiudadanos: CiudadanoModel[]=[];
  listDepartamentos: DepartamentoModel[]=[];
  listMunicipios: MunicipioModel[]= [];
  listSexo: SexoModel[]=[];

  constructor(
    private ciudadanosService: CiudadanosService
  ) { }

  ngOnInit(): void {
    this.listarCiudadanos();
    
  }


  //LISTADO DE CIUDADANOS
  listarCiudadanos(){    
    this.ciudadanosService.listarCiudadanosTodos().
        subscribe(respuesta => {
        this.listCiudadanos= respuesta[0];
        console.log("ciudadanos", this.listCiudadanos);
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE CIUDADANOS....................................................... 

}


