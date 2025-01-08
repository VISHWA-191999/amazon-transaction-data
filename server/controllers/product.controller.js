import product from "../modals/product.modal.js";

//feetch seed data from api and store in db
export const fetchSeedData = async () => {
  try {
    const response = await fetch(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const data = await response.json();
    // console.log(data);
    await product.deleteMany({});
    const result = await product.insertMany(data);
    //    console.log(result);
  } catch (error) {
    console.log("error storing seed data", error.message);
    throw error;
  }
};

// get all transactions
export const getAllTransactions = async (req, res) => {
  try {
    console.log("inside getAllTransactions controller");
    const { month, search, page = 1, perPage = 10 } = req.query;
    // const filter = {};
    console.log(month , search)
    // console.log(filter)
    // if (month) {
    //   const start = new Date(`${month} 1, 2023`);
    //   const end = new Date(start);
    //   end.setMonth(start.getMonth() + 1);
    //   filter.dateOfSale = { $gte: start, $lt: end };
    // }
    // if (month) {
    //     // Convert month to 2 digits (e.g., 5 -> "05")
    //     const monthStr = month.toString().padStart(2, '0');
    //     console.log(monthStr)
    //     filter.dateOfSale = {
    //       $regex: `\\d{4}-${monthStr}-\\d{}`
    //     };
    //   }

    let pipeline = [];
    if (month) {
        pipeline.push({
          $match: {
            $expr: {
              $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
            }
          }
        });
      }
      console.log(pipeline)

    //   db.collection.aggregate([
    //     {
    //       $project: {
    //         month: { $month: "$dateSale" }
    //       }
    //     }
    //   ])
    

    // console.log(filter)

    // if (search) {
    //   filter.$or = [
    //     { title: new RegExp(search, "i") },
    //     { description: new RegExp(search, "i") },
    //     { price: parseFloat(search) || 0 },
    //   ];
    // }
    // Add search filter if provided
    if (search) {
        pipeline.push({
          $match: {
            $or: [
              { title: new RegExp(search, "i") },
              { description: new RegExp(search, "i") },
              { price: parseFloat(search) || 0 }
            ]
          }
        });
      }
    
       // Get total count
    const totalDocs = await product.aggregate([...pipeline, { $count: "total" }]);
    const total = totalDocs[0]?.total || 0;

       // Add pagination
       pipeline.push(
        { $skip: (parseInt(page) - 1) * parseInt(perPage) },
        { $limit: parseInt(perPage) }
      );
  
      // Execute final query
      const transactions = await product.aggregate(pipeline);
  
      res.json({ transactions, total });

    // const transactions = await product
    //   .find(filter)
    //   .skip((page - 1) * perPage)
    //   .limit(Number(perPage));

    // const total = await product.countDocuments(filter);

    // res.json({ transactions, total });

  } catch (error) {
    console.log("error fetching transactions", error.message);
    res.status(500).json({ error: "Internal server error" });
  }

};

// Get Statistics
export const getStatistics = async (req, res) => {
    try {
        const { month } = req.query;
        console.log(month);
        
        let pipeline = [];
        
        if (month) {
            pipeline.push({
                $match: {
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
                    }
                }
            });
        }

        const totalSaleAmount = await product.aggregate([
            ...pipeline,
            { $group: { _id: null, total: { $sum: "$price" } } }
        ]);

        const soldItems = await product.countDocuments({
            ...(month && {
                $expr: {
                    $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
                }
            }),
            sold: true
        });

        const unsoldItems = await product.countDocuments({
            ...(month && {
                $expr: {
                    $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
                }
            }),
            sold: false
        });

        res.json({
            totalSaleAmount: totalSaleAmount[0]?.total || 0,
            soldItems,
            unsoldItems,
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching statistics: " + error.message });
    }
};

  // Get Bar Chart Data
export const getBarChartData = async (req, res) => {
    try {
        const { month } = req.query;
        let pipeline = [];

        if (month) {
            pipeline.push({
                $match: {
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
                    }
                }
            });
        }

        const ranges = [
            { range: "0-100", min: 0, max: 100 },
            { range: "101-200", min: 101, max: 200 },
            { range: "201-300", min: 201, max: 300 },
            { range: "301-400", min: 301, max: 400 },
            { range: "401-500", min: 401, max: 500 },
            { range: "501-600", min: 501, max: 600 },
            { range: "601-700", min: 601, max: 700 },
            { range: "701-800", min: 701, max: 800 },
            { range: "801-900", min: 801, max: 900 },
            { range: "901-above", min: 901, max: Infinity },
        ];

        const barChartData = await Promise.all(
            ranges.map(async (range) => {
                const matchStage = [...pipeline];
                matchStage.push({
                    $match: {
                        price: {
                            $gte: range.min,
                            $lt: range.max === Infinity ? Infinity : range.max
                        }
                    }
                });

                const result = await product.aggregate([
                    ...matchStage,
                    { $count: "count" }
                ]);

                return {
                    range: range.range,
                    count: result[0]?.count || 0
                };
            })
        );

        res.json(barChartData);
    } catch (error) {
        res.status(500).json({ error: "Error fetching bar chart data: " + error.message });
    }
};
  
  // Get Pie Chart Data
  export const getPieChartData = async (req, res) => {
    try {
        const { month } = req.query;
        let pipeline = [];

        if (month) {
            pipeline.push({
                $match: {
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
                    }
                }
            });
        }

        const pieChartData = await product.aggregate([
            ...pipeline,
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $project: { category: "$_id", count: 1, _id: 0 } }
        ]);

        res.json(pieChartData);
    } catch (error) {
        res.status(500).json({ error: "Error fetching pie chart data: " + error.message });
    }
};
  
  // Get Combined Data
  export const getCombinedData = async (req, res) => {
    try {
      const statistics = await this.getStatistics(req, res);
      const barChart = await this.getBarChartData(req, res);
      const pieChart = await this.getPieChartData(req, res);
  
      res.json({ statistics, barChart, pieChart });
    } catch (error) {
      res.status(500).send("Error fetching combined data: " + error.message);
    }
  };
  