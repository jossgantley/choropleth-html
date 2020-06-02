        var legW= 440
        var legH= 60
        const legPaddingH = 80;
        const legPaddingV = 10
        
        var w= 0.675 * window.innerWidth;
        var h= 0.75 * window.innerHeight;
        const paddingH = 80;
        const paddingV= 100;
        const svg = d3.select("#app")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .style("background-color", "lightblue")

       

        const legend = svg.append("svg")
        .attr("width", legW)
        .attr("height", legH)
        .attr("x", 0.5*w)
        .attr("y", 0.05*h ) 
        .attr("id", "legend")
        
        
        const svgDefs = legend.append("defs")

        const grad = svgDefs.append("linearGradient")
            .attr("id", "grad")
        
        grad.append("stop")
            .attr("class", "stop-one")
            .attr("offset", 0)
        
       
        
        grad.append("stop")
            .attr("class", "stop-two")
            .attr("offset", 1)

        legend.append("rect")
            .classed("filled", "true")
            .attr("width", legW-2*legPaddingH)
            .attr("x", legPaddingH)
            .attr("height", (legH/2) - legPaddingV)

       

        legend.append("rect")
            .style("fill", "orange")
            .style("display", "none")
            legend.append("rect")
            .style("fill", "white")
            .style("display", "none")
            legend.append("rect")
            .style("fill", "green")
            .style("display", "none")
            legend.append("rect")
            .style("fill", "blue")
            .style("display", "none")
        
         
        const numMonth = d3.scaleBand()
        
            .domain([11,10,9,8,7,6,5,4,3,2,1,0])
            .range([h-paddingV, paddingV])
            
        const greenScale = d3.scaleLinear()
            .domain([0,80])
            .range(["lightgreen", "darkgreen"])
    
        const legScale = d3.scaleLinear()
            .domain([0,80])
            .range([legPaddingH, legW - legPaddingH])
    
        const tooltip= d3.select("body")
                .append("div")
                .attr("id", "tooltip")
                .style("opacity", "0")
        
        

        const legAxis = d3.axisBottom(legScale)
        .tickFormat(num=>num+"%");

        
        
        legend.append("g")
            .attr("id", "legend-axis")
            .attr("transform", "translate(0," + (legH/2-legPaddingV) + ")")
           
            .call(legAxis)



    let data1 = ("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
    let data2 = ("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")

    const data = [data1, data2]
    const promises = []

    data.forEach(api=>promises.push(d3.json(api)))

    Promise.all(promises).then(data=>{
        
            data[1].objects.counties.geometries.unshift([])
        
            const geo = topojson.feature(data[1], data[1].objects.counties)

            const path = d3.geoPath()
            svg.selectAll("path")
            .data(geo.features)
            .enter()
            .append("path")
            .attr("class", "county")
            .attr("fill", d=> {return greenScale(data[0].filter(item=>{
                if (item.fips===d.id){
                    return item
                }
            })
        [0].bachelorsOrHigher)}) 
            .attr("data-fips", d=>d.id)
            .attr("data-education", d=>{return data[0].filter(item=>{
                if (item.fips===d.id){
                    return item
                }
            })
        [0].bachelorsOrHigher})
            .attr("d", path)
            .on("mousemove", (d)=>{
                let dataEd=data[0].filter(item=>{
                    if (item.fips===d.id){
                        return item
                    }
                })
                tooltip
                    .style("opacity", "0.9")
                    .html(`${dataEd[0].area_name}, ${dataEd[0].state}: ${dataEd[0].bachelorsOrHigher}%`)
                    .attr("data-education", dataEd[0].bachelorsOrHigher)
                    .style("top", d3.event.pageY - 50 + "px")
                    .style("left", d3.event.pageX  + 10 + "px")
               })
            .on("mouseleave", ()=>tooltip.style("opacity", "0"))
     
    }).catch((err)=>{
        console.log("Error")
    })
    
            
window.onresize = ()=>{
    h= 0.6 * window.innerHeight
    w= 0.8 * window.innerWidth
}
            
    



