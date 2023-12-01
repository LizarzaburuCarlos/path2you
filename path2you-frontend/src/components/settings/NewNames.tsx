import { useEffect, useState } from "react";
import type User from "../../interfaces/user";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fetchApi from "../../lib/strapi";

const NewNames = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setUserData(user);
    } else {
      console.error("No se encontró usuario.");
    }
  }, []);

  const updateNames = async (data, userDataResponse) => {
    try {
      const res = await fetchApi({
        endpoint: `/users/${userDataResponse.id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userDataResponse.jwt}`,
        },
        method: "PUT",
        body: {
          id: userDataResponse.id,
          name: data.name,
        },
      });
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    ) as any;
    setLoading(true);

    try {
      if (!data.name) {
        toast.error("Por favor, ingresa todos los datos.");
        setLoading(false);
        return;
      }

      const res = await updateNames(data, userData);

      toast.success("Nombres actualizados exitosamente");
      setTimeout(() => {
        location.replace("/profile");
      }, 2000);
    } catch (error: any) {
      console.log(error);

      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <section className="new-names w-full">
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      )}

      <div className="new-names__presentation">
        <h1 className="new-names__title text-3xl font-bold mb-2">
          Cambiar nombres
        </h1>
        <p className="new-names__text">Cambia tus nombres aquí:</p>
      </div>
      <form
        onSubmit={handleSubmit}
        method="post"
        autoComplete="off"
        className="form rounded-lg w-full mt-8 overflow-hidden"
      >
        <div className="form__container w-full py-11 px-8 rounded-xl overflow-hidden flex flex-col gap-4">
          <label
            htmlFor="name"
            className="form__label text-lg md:text-xl font-semibold"
          >
            Nombres y Apellidos:
          </label>

          <input
            type="text"
            placeholder="Ingrese sus nombres y apellidos"
            aria-label="Nombres & Apellidos"
            name="name"
            id="name"
            className="form__input"
            minLength={3}
            required
          />
        </div>
        <div className="form__footer w-full flex flex-col items-center mt-8">
          <button
            type="submit"
            className="form__submit button-primary change mb-4 max-w-sm"
          >
            Cambiar Nombres
          </button>
        </div>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </section>
  );
};

export default NewNames;
