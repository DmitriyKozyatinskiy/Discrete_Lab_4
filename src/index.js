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
    const incidenseGraphTable = new Table('incidenseTableContainer');
    incidenseGraphTable.setNodes(graphTable.getNodes());

    graphTable.setCellClickCallback(() => {
        incidenseGraphTable
            .setEdges(graphTable.getEdges())
            .fillIncidenceTable();
    });

    $(document).on('click', '#js-save-graph', event => {
        localStorage.setItem('graphData', JSON.stringify(graphTable.getData()));
    }).on('click', '#js-load-graph', event => {
        const data = JSON.parse(localStorage.getItem('graphData'));
        graphTable.setEdges(data.edges).fillTable();
        graph.setNodes(data.nodes).setEdges(data.edges);
    }).on('click', '#js-clear-graph', event => {
        graphTable._resetTable();
        incidenseGraphTable._resetTable();
    });
});
