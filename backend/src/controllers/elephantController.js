export const getElephants = (req, res) => {
  res.json([
    {
      id: 1,
      name: "Herd A",
      status: "moving",
      location: [21.1, 82.3]
    }
  ]);
};
