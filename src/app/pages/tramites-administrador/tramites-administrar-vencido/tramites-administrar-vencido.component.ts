import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConvocadoModel } from 'src/app/models/convocado.model';
import { TramiteModel } from 'src/app/models/tramite.model';
import { VinculadoModel } from 'src/app/models/vinculado.model';
import { DataService } from 'src/app/service/data.service';
import { TramitesService } from 'src/app/service/tramites.service';

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

    listaConvocadosPersonasFisicas: ConvocadoModel[]=[];
    listaConvocadosPersonasJuridicas: ConvocadoModel[]=[];
    
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
            this.listaConvocadosPersonasFisicas = this.dataTramite.convocados.filter(c => !c.isPersonaJuridica);
            this.listaConvocadosPersonasJuridicas = this.dataTramite.convocados.filter(c => c.isPersonaJuridica);
            
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
