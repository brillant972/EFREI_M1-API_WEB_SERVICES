import axios from 'axios';

const RANDOMMER_API_KEY = '4244b21aec044c3682853fabdca07890';

const headers = {
  'X-Api-Key': RANDOMMER_API_KEY
};

const getRandomUser = () => axios.get('https://randomuser.me/api/').then((res) => res.data.results[0]);
const getPhone = () => axios.get('https://randommer.io/api/Phone/Generate?CountryCode=FR&Quantity=1', { headers }).then((res) => res.data[0]);
const getIBAN = () => axios.get('https://randommer.io/api/Finance/Iban/FR', { headers }).then((res) => res.data[0]);
const getCreditCard = () => axios.get('https://randommer.io/api/Card?type=AmericanExpress', { headers }).then((res) => res.data);
const getRandomName = () => axios.get('https://randommer.io/api/Name?nameType=firstname&quantity=1', { headers }).then((res) => res.data[0]);
const getPet = async () => { const res = await axios.get('https://catfact.ninja/fact'); return res.data.fact; };

class Pipeline {
  constructor(app) {
    this.app = app;
    this.registerRoute();
  }

  registerRoute() {
    this.app.get('/generate', async (req, res) => {
      try {
        const [
          user,
          phone,
          iban,
          creditCard,
          randomName,
          pet
        ] = await Promise.all([
          getRandomUser(),
          getPhone(),
          getIBAN(),
          getCreditCard(),
          getRandomName(),
          getPet()
        ]);

        const result = {
          user: {
            name: `${user.name.first} ${user.name.last}`,
            email: user.email,
            gender: user.gender,
            location: `${user.location.city}, ${user.location.country}`,
            picture: user.picture.large
          },
          phone_number: phone,
          iban,
          credit_card: {
            card_number: creditCard.cardNumber,
            card_type: creditCard.type,
            expiration_date: creditCard.date,
            cvv: creditCard.cvv
          },
          random_name: randomName,
          pet
        };

        res.status(200).json(result);
      } catch (err) {
        console.error('[ERROR] /generate ->', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des données enrichies.', error: err.message });
      }
    });
  }
}

export default Pipeline;
