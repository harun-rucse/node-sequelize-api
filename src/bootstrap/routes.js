const routes = (app) => {
  app.use("/api", (req, res) => {
    res.status(200).send("Hello from server!");
  });
};

export default routes;
