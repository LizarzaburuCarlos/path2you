import { useEffect, useState } from "react";
import type User from "../../interfaces/user";
import fetchApi from "../../lib/strapi";
import { formatDate } from "../../core/helpers";

const UserCard = () => {
  const [userData, setUserData] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      fetchUser(user);
    } else {
      console.error("No se encontró usuario.");
    }
  }, []);
  
  const fetchUser = async (userDataResponse) => {
    try {
        const user = await fetchApi<User>({
            endpoint: "users/" + userDataResponse.id.toString(),
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${userDataResponse.jwt}`,
              },   
            method: "GET",
        });
        setUserData(user);

    } catch (error) {
        console.error(error);
    }
    setLoading(false);
};

  return (
    <div className="user-card w-full">
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      )}

      <h3 className="user-card__title font-bold text-lg md:text-xl">Cuenta:</h3>
      <div className="user-card__container flex flex-col md:flex-row items-center gap-8 w-full mt-4 px-10 mx-auto p-8 rounded-lg overflow-hidden">
        <div className="user-card__profile min-w-[60px] w-24">
          <img
            src="/usericon.png"
            alt="Foto de perfil"
            className="user-card__img w-full"
          />
        </div>
        <div className="user-card__information">
          <h2 className="user-card__name text-lg md:text-xl font-semibold ">
            {userData?.name}
          </h2>
          <p className="user-card__username text-base md:text-lg">@{userData?.username}</p>
          <p className="user-card__email text-base md:text-lg italic">{userData?.email}</p>
          <p className="user-card__date text-base md:text-lg">Estas aquí desde {formatDate(userData?.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
