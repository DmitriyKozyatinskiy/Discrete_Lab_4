import $ from 'jquery';
import _ from 'lodash/array'
import NProgress from 'nprogress-npm';
import '../node_modules/nprogress-npm/nprogress.css';
import Table from './Components/Table/Table';
import Graph from './Components/Graph/Graph';


$(() => {
    const graph = new Graph('graphContainer');
    const graphTable = new Table('tableContainer', graph);
    graph.setNodes(graphTable.getNodes());
    graph.drawGraph();
    console.log(graphTable.getData());
});
