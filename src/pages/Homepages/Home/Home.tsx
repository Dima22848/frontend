import { Outlet } from "react-router-dom";


const Home = () => (
    <>
        <h1>Главная</h1>
        <Outlet />
    </>
)

export default Home;