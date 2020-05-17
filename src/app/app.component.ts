import { Component } from '@angular/core';
import * as dracula from 'graphdracula';

const Graph = dracula.Graph;
const Renderer = dracula.Renderer.Raphael;
const Layout = dracula.Layout.Spring;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-floyd';

  public graph:dracula.Graph;
  public count:any;
  public bestPath:any={};
  public startPoint:any;
  public resultingPaths:any[];
  public done:boolean;
  public resultArray:string[];
  public nodesNumber:number;
  public nodes:any=[];


  constructor(){  
    this.graph=new Graph();    
    this.bestPath="";
    this.resultArray=[];
    this.nodes=[];
    this.nodesNumber=3;
    this.newMatrix();
  }

  public newMatrix(){
    this.nodes=[]
    for(let i=0;i<this.nodesNumber;i++){
      let line=[]
      for(let j=0;j<this.nodesNumber;j++){
        let node=0;
        line.push(node);
      }
      this.nodes.push(line);
    }
  }

  public plotGraph(){
    this.resultArray=[];
    let g=new Graph();

    for(let i=0;i<this.nodesNumber;i++){
      for(let j=0;j<this.nodesNumber;j++){
        if(i==j || !this.nodes[i][j]){
          continue;
        }
        g.addEdge(i.toString(),j.toString(),this.nodes[i][j],{
          directed: true,
          label: this.nodes[i][j].toString()})
      }
    }
    this.resultingPaths= this.floyd_warshall(g);
    let keys=Object.keys(this.resultingPaths);
    for(let item of Object.keys(this.resultingPaths)){
      let newString="["+item+"]"+"--->";
      let i=0;
      for(let value of Object.values(this.resultingPaths[item])){
        if(value==0 || value==Infinity){
          i++;
          continue;
        }
        newString+=" ["+keys[i]+"] : "+value;
        i++;
      }
      this.resultArray.push(newString);
    }
    let nodes=[];
    for(let i=0;i<this.nodesNumber;i++){
      nodes.push(i.toString());
    }
    for(let name of nodes){
      let check=false;
      for(let item in g.nodes){
        debugger;        
        if(name==g.nodes[item].id){
          check=true;
        }
      }
      if(!check){
        g.addNode(name);
      }
    }

      var layout2 = new Layout(g);
      layout2.layout();
      var renderer2= new Renderer('#canvas',g, 750, 750);
      renderer2.draw();
      this.done=true;
  }



  floyd_warshall(g) {
    var path = [];
    var next = [];
    var i = void 0,
        j = void 0,
        k = void 0,
        e = void 0;

    for (j in g.nodes) {
      path[j] = [];
      next[j] = [];
      for (i in g.nodes) {
        path[j][i] = j === i ? 0 : Infinity;
      }
    }
    for (e in g.edges) {
      path[g.edges[e].source.id][g.edges[e].target.id] = g.edges[e].weight;
    } 
    for (i in g.nodes) {
      for (j in g.nodes) {
        for (k in g.nodes) {
          if (path[i][j] > path[i][k] + path[k][j]) {
            path[i][j] = path[i][k] + path[k][j];
  
          }
        }
      }
    }
    return path;
  }
}
  
