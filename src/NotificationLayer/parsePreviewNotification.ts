const parsePreviewNotification = (mocoPreviewObject: { id: number, graphs: Object }) => {
    let properties = {};
    const features = Object.keys(mocoPreviewObject.graphs).map((graph) => {
        const feature = mocoPreviewObject.graphs[graph].features[0];
        properties =  mocoPreviewObject.graphs[graph].properties;
        return { ...feature, properties: { ...feature.properties, graph } };
    });
    return {
        type: "FeatureCollection",
        properties,
        features,
    };
}

export default parsePreviewNotification;