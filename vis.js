async function render() {

  const data = await d3.csv("videogames_wide.csv");
  console.log("Data loaded successfully:", data.length, "rows found.");

  
// VIS 1: Which Genre/Platform combos make the most money?
    const spec1 = vl
      .markRect()
      .data(data)
      .encode(
        vl.x().fieldN("Platform"),
        vl.y().fieldN("Genre"),
        vl.color().fieldQ("Global_Sales").aggregate("sum")
      )
      .width(600)
      .height(400)
      .toSpec();

    await vegaEmbed("#vis1", spec1);
    console.log("Vis 1 rendered.");

    //VIS 2: Line/Area Chart
    const spec2 = vl
      .markArea()
      .data(data)
      .encode(
        vl.x().fieldT("Year"),
        vl.y().fieldQ("Global_Sales").aggregate("sum"),
        vl.color().fieldN("Genre")
      )
      .width(600)
      .height(400)
      .toSpec();

    await vegaEmbed("#vis2", spec2);
    console.log("Vis 2 rendered.");


  //Vis 3
  const spec3 = vl
    .markBar()
    .data(data) 
    .encode(
      vl.x().fieldN("Platform"),
      vl.y().fieldQ("JP_Sales").aggregate("sum")
    )
    .width(600)
    .toSpec();
  await vegaEmbed("#vis3", spec3);

  // Vis 4: Top 10 publishers by global sales
  const spec4 = vl
    .markBar()
    .data(data)
    .transform(
      vl.aggregate(vl.sum("Global_Sales").as("Total")).groupby("Publisher"),
      vl.window(vl.rank().as("rank")).sort([{field: "Total", order: "descending"}]),
      vl.filter("datum.rank <= 10")
    )
    .encode(
      vl.x().fieldQ("Total"),
      vl.y().fieldN("Publisher").sort("-x")
    )
    .width(600)
    .toSpec();
  await vegaEmbed("#vis4", spec4);

} 

render();