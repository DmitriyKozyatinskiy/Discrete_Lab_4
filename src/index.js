import $ from 'jquery';
import _ from 'lodash/array'
import NProgress from 'nprogress-npm';
import '../node_modules/nprogress-npm/nprogress.css';
import Table from './Components/Table/Table';
import Graph from './Components/Graph/Graph';
import aboutTemplate from './Components/About/About.html'

const $body = $('body');

$(() => {
    $body.append($(aboutTemplate)).show();

    const graph = new Graph('graphContainer');
    const graphTable = new Table('tableContainer', graph);
    graphTable.fillTable();
    graph.setNodes(graphTable.getNodes());
    graph.drawGraph();
    console.log(graphTable.getData());
    const incidenseGraphTable = new Table('incidenseTableContainer');
    incidenseGraphTable.setNodes(graphTable.getNodes());

    graphTable.setCellClickCallback(() => {
        incidenseGraphTable
            .setEdges(graphTable.getEdges())
            .fillIncidenceTable();
    });
});
