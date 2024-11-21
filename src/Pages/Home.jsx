import { db } from "../Helpers/firebaseConfig";
console.log(db); // This should log a Firestore instance if setup is correct
const Home = () => {
    return <h1>Home</h1>;
  };
  
  export default Home;