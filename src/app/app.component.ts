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
  public nodeName:string;
  public nodeOptions:any=[];
  public config:any;
  public edgeParent:any;
  public edgeChild:any;
  public edgeValue:number;
  public bestPath:any={};
  public startPoint:any;
  public resultingPaths:any[];
  public done:boolean;
  public resultArray:string[];
  constructor(){
    this.graph=new Graph();  
    this.nodeName="";
    this.edgeChild="";
    this.edgeParent="";
    this.startPoint="";
    this.edgeValue=0;
    this.bestPath="";
    this.nodeOptions=[];
    this.config = {
      labelField: 'label',
      valueField: 'value',
      searchField: 'label',
      highlight: false,
      create:false,
      persist:true,
      //plugins: ['dropdown_direction', 'remove_button'],
      dropdownDirection: 'down',
      maxItems: 1
    };
    this.resultArray=[];

  }
  public addNode(){
    if(this.nodeName==""){
      alert("Имя узла не может быть пустым");
      return;
    }
    this.graph.addNode(this.nodeName);
    this.nodeOptions.push(this.nodeName)
    this.nodeName="";
  }
  
  public addEdge(){
    if(this.edgeChild=="" ||this.edgeParent==""){
      alert("Заполните все поля");
      return;
    }
    if(this.edgeChild==this.edgeParent){
      alert("Родительский и дочерний узлы не могут совпадать");
      return;
    }

    this.graph.addEdge(this.edgeParent,this.edgeChild,this.edgeValue,{
      directed: true, // ориентированное ребро
      stroke: "#fff", fill: "#5a5", // цвета ребра
      label: this.edgeValue.toString()} ); // надпись над ребром
    this.edgeChild="";
    this.edgeParent="";
    this.edgeValue=0;
    this.done=false;
  }

  public plotGraph(){
    if(this.resultArray.length!=0){
      this.resultArray=[];
    }
    if(this.done){
      this.done
      return;
    }
    this.resultingPaths= this.floyd_warshall();
    let keys=Object.keys(this.resultingPaths);
    for(let item of Object.keys(this.resultingPaths)){
      let newString="["+item+"]"+"--->";
      let i=0;
      for(let value of Object.values(this.resultingPaths[item])){
        if(value==0 || value==Infinity){
          continue;
        }
        newString+=" ["+keys[i]+"] : "+value;
        i++;
      }
      this.resultArray.push(newString);
    }
      const layout2 = new Layout(this.graph);
      const renderer2= new Renderer('#canvas', this.graph, 750, 750);
      renderer2.draw();
      this.done=true

  }

  floyd_warshall() {
    var path = [];
    var next = [];
    var i = void 0,
        j = void 0,
        k = void 0,
        e = void 0;

    for (j in this.graph.nodes) {
      path[j] = [];
      next[j] = [];
      for (i in this.graph.nodes) {
        path[j][i] = j === i ? 0 : Infinity;
      }
    }
    for (e in this.graph.edges) {
      path[this.graph.edges[e].source.id][this.graph.edges[e].target.id] = this.graph.edges[e].weight;
    } 
    for (i in this.graph.nodes) {
      for (j in this.graph.nodes) {
        for (k in this.graph.nodes) {
          if (path[i][j] > path[i][k] + path[k][j]) {
            path[i][j] = path[i][k] + path[k][j];
  
          }
        }
      }
    }
    return path;
  }
}
  
