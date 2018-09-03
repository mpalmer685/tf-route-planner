import { Delaunay } from 'd3-delaunay'
import { polygonCentroid } from 'd3-polygon'
import parser from 'fast-xml-parser'
import flatten from 'lodash/flatten'
import get from 'lodash/get'
import groupBy from 'lodash/groupBy'
import partition from 'lodash/partition'
import skmeans from 'skmeans'

self.addEventListener('message', parseMap)

const INDUSTRY_NAMES = [
    'Chemical plant',
    'Coal mine',
    'Construction materials plant',
    'Farm',
    'Food processing plant',
    'Forest',
    'Goods factory',
    'Iron ore mine',
    'Machine factory',
    'Oil refinery',
    'Oil well',
    'Quarry',
    'Saw mill',
    'Steel mill'
]

function parseMap({ data: fileContent }) {
    const fileData = parser.parse(fileContent, {
        ignoreAttributes: false,
        attributeNamePrefix: '',
        attrNodeName: 'attrs'
    })
    const mapData = getMapData(fileData)

    this.postMessage(getMap(mapData))
}

function getMapData(fileData) {
    return findValueWithKey(fileData, 'svg')
}

function findValueWithKey(object, key) {
    if (!object) {
        return object
    }

    for (const objKey in object) {
        if (objKey === key) {
            return object[key]
        } else if (object.hasOwnProperty(objKey) && typeof object[objKey] === 'object') {
            const result = findValueWithKey(object[objKey], key)
            if (result) {
                return result
            }
        }
    }
}

function getMap(data) {
    const { attrs, g: townGroups, polygon: dataPoints, text: labels } = data
    const [industryNodes, townBuildings] = partition(dataPoints, d => d.attrs.class === 'industry')

    const townNames = labels
        .map(l => l['#text'])
        .map(removeIndustryName)
        .filter((value, index, array) => array.indexOf(value) === index)

    const size = getMapSize(attrs)

    const findClosest = (points, delaunay) => (x, y) => {
        const index = delaunay.find(x, y)
        return points[index]
    }

    const labelPoints = Delaunay.from(labels, d => d.attrs.x, d => d.attrs.y)
    const industries = getIndustries(industryNodes, findClosest(labels, labelPoints))
    const industryPoints = Delaunay.from(industries, d => d.x, d => d.y)
    const towns = getTowns(townBuildings, townGroups, townNames, industries, findClosest(industries, industryPoints))

    return { size, industries, towns }
}

function removeIndustryName(name) {
    return INDUSTRY_NAMES.reduce((fullName, industry) => fullName.replace(industry, ''), name)
        .trim()
        .replace(/\s+#\d/, '')
}

function getMapSize({ viewBox }) {
    const [, , width, height] = viewBox.split(' ').map(d => parseInt(d))
    return { width, height }
}

function getIndustries(industryNodes, findLabel) {
    const industries = industryNodes.map(getIndustryLocation).map(addIndustryLabel)
    const industriesByLabel = groupBy(industries, 'label')
    Object.keys(industriesByLabel).forEach(label => {
        const i = industriesByLabel[label]
        if (i.length > 1) {
            i.forEach(l => {
                l.label = 'Unknown industry'
            })
        }
    })

    return industries

    function getIndustryLocation(node) {
        const points = node.attrs.points.split(' ').map(pair => pair.split(',').map(f => parseFloat(f)))
        const [x, y] = polygonCentroid(points)
        return { x, y }
    }

    function addIndustryLabel(node) {
        const closestLabel = findLabel(node.x, node.y)
        const nodeWithLabel = Object.assign({}, node)
        nodeWithLabel.label = get(closestLabel, '#text', 'Unknown Industry')
        return nodeWithLabel
    }
}

function getTowns(townBuildings, townGroups, townNames, industries, findLabel) {
    const points = townBuildings.map(d => d.attrs.points).map(getPoints)

    const industriesByTownName = groupBy(industries, i => townNames.find(n => i.label.startsWith(n)))
    const initialCentroids = Object.keys(industriesByTownName)
        .map(name => industriesByTownName[name][0])
        .map(({ x, y }) => [x, y])

    const clusters = skmeans(flatten(points), townGroups.length, initialCentroids)

    return clusters.centroids.map(c => {
        const [x, y] = c
        const closestLabel = findLabel(x, y)
        return {
            x,
            y,
            label: removeIndustryName(closestLabel.label)
        }
    })
}

function getPoints(data) {
    return data.split(' ').map(pair => pair.split(',').map(f => parseFloat(f)))
}
