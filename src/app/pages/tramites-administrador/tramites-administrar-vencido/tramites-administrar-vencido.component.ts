import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudienciaModel } from 'src/app/models/audiencia.model';
import { ConvocadoModel } from 'src/app/models/convocado.model';
import { ResultadoAudienciaModel } from 'src/app/models/resultadoAudiencia.model';
import { TramiteModel } from 'src/app/models/tramite.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { UsuarioTramiteModel } from 'src/app/models/usuario_tramite.model';
import { VinculadoModel } from 'src/app/models/vinculado.model';
import { AudienciasService } from 'src/app/service/audiencias.service';
import { DataService } from 'src/app/service/data.service';
import { TramitesService } from 'src/app/service/tramites.service';
import { UsuariosTramiteService } from 'src/app/service/usuarios-tramite.service';
import { AuthService } from '../../../service/auth.service';
import { PdfsService } from 'src/app/service/pdfs.service';

@Component({
  selector: 'app-tramites-administrar-vencido',
  templateUrl: './tramites-administrar-vencido.component.html',
  styleUrls: ['./tramites-administrar-vencido.component.scss']
})
export class TramitesAdministrarVencidoComponent implements OnInit {

  //MODELOS
    dataConvocado: ConvocadoModel = {};
    dataTramite: TramiteModel= new TramiteModel;
    dataTramiteAux: TramiteModel= new TramiteModel;
    dataVinculado: VinculadoModel = {};
    
    //booleans
    loadingUsuariosTramite: boolean = true;
    
    convocadoDialog: boolean = false;  
    vinculadoDialog: boolean = false;
  
    constructor(
      private router: Router,
      
      public dataService: DataService,  
      private tramiteService: TramitesService,  
    ) { }
  
    ngOnInit(): void {
  
      //obtener tramite    
      this.dataTramiteAux= this.dataService.tramiteData;
      if(this.dataTramiteAux.numero_tramite){  
        
        this.buscarTramite();    
      }  
      else{
  
        this.router.navigateByUrl("admin/tramites/vencidos");
      }  
      //fin obtener tramite
  
    }
    //FIN ONINIT........................................
  
    
    //BUSCAR TRAMITE 
    buscarTramite(){  
      this.dataTramite = {};  
      
      this.tramiteService.buscarTramiteNumTram(this.dataService.tramiteData.numero_tramite)
        .subscribe({
          next: (resultado) => {          
            this.dataTramite = {};
            this.dataTramite = resultado; 
          }
        });    
    }
    //FIN BUSCAR TRAMITE................................................................... 
  
    //MANEJO DE FORMULARIO DIALOG CONVOCADO
    openDialogConvocado(convocado: ConvocadoModel) {
      this.dataConvocado = convocado;
      this.convocadoDialog = true; 
      
    }
    
    hideDialogConvocado() {    
      this.convocadoDialog = false;    
    }    
    //FIN MANEJO FORMULARIO DIALOG CONVOCADO....................................
  
    

}
