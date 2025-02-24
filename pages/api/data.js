export default async function handler(req, res) {
  const { cityInput } = req.body;
  const getWeatherData = await fetch(
    `https://api.openweathermap.org/data/2.5/group?id=2988507,2995469,2998324&appid=524f8e6e04d7aeee9b0e7c149ec2c503`,
  );
  const data = await getWeatherData.json();
  res.status(200).json(data);
}

