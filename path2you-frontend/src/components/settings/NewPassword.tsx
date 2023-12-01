import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fetchApi from "../../lib/strapi";
import type User from "../../interfaces/user";

const NewPassword = () => {
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

  const updatePassword = async (data, userDataResponse) => {
    try {
      const res = await fetchApi({
        endpoint: "auth/change-password",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userDataResponse.jwt}`,
        },
        method: "POST",
        body: {
          currentPassword: data.password,
          password: data.newPassword,
          passwordConfirmation: data.confirmPassword,
        },
      });
      console.log(res);

      if ((res as any)?.error?.message.includes("invalid")) {
        return "PASSWORD_INVALID";
      } else if ((res as any)?.error?.message.includes("different")) {
        return "PASSWORD_DIFFERENT";
      } else {
        console.log("No hay error en la respuesta");
      }
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
      if (!data.password || !data.newPassword || !data.confirmPassword) {
        toast.error("Por favor, ingresa todos los datos.");
        setLoading(false);
        return;
      }

      if (data.newPassword !== data.confirmPassword) {
        toast.error("Las contraseñas no coinciden. Por favor, verifica.");
        setLoading(false);
        return;
      }

      const res = await updatePassword(data, userData);

      if (res == "PASSWORD_INVALID") {
        toast.error("Contraseña actual incorrecta");
      } else if (res == "PASSWORD_DIFFERENT") {
        toast.error("La nueva contraseña es idéntica a la actual.");
      } else {
        toast.success("Contraseña cambiada exitosamente");
        localStorage.setItem("user", "");

        setTimeout(() => {
          location.replace("/login");
        }, 2000);
      }
    } catch (error: any) {
      console.log(error);

      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <section className="new-password w-full">
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      )}

      <div className="new-password__presentation">
        <h1 className="new-password__title text-3xl font-bold mb-2">
          Nueva Contraseña
        </h1>
        <p className="new-password__text">Cambia tu contraseña aquí:</p>
      </div>
      <form
        onSubmit={handleSubmit}
        method="post"
        autoComplete="off"
        className="form rounded-lg w-full mt-8 overflow-hidden"
      >
        <div className="form__container w-full py-11 px-8 rounded-xl overflow-hidden outline-none flex flex-col md:flex-row gap-8">
          <div className="form__division w-full md:w-1/3 flex flex-col gap-4">
            <label
              htmlFor="password"
              className="form__label text-lg md:text-xl font-semibold"
            >
              Contraseña Actual:
            </label>
            <input
              type="password"
              placeholder="Escribe tu contraseña actual"
              aria-label="Contraseña Actual"
              name="password"
              id="password"
              className="form__input"
              minLength={5}
              required
            />
          </div>
          <div className="form__division w-full md:w-1/3 flex flex-col gap-4">
            <label
              htmlFor="newPassword"
              className="form__label text-lg md:text-xl font-semibold"
            >
              Contraseña Nueva:
            </label>
            <input
              type="password"
              placeholder="Escribe tu contraseña nueva"
              aria-label="Contraseña Nueva"
              name="newPassword"
              id="newPassword"
              className="form__input"
              minLength={5}
              required
            />
          </div>

          <div className="form__division w-full md:w-1/3 flex flex-col gap-4">
            <label
              htmlFor="confirmPassword"
              className="form__label text-lg md:text-xl font-semibold"
            >
              Contraseña Nueva:
            </label>
            <input
              type="password"
              placeholder="Repite la Contraseña Nueva"
              aria-label="Repite la Contraseña Nueva"
              name="confirmPassword"
              id="confirmPassword"
              className="form__input"
              minLength={5}
              required
            />
          </div>
        </div>
        <div className="form__footer w-full flex flex-col items-center mt-8">
          <h3 className=" text-base md:text-lg font-semibold mb-4">
            <span className="text-orange-500 mr-2">*</span>
            Al momento de cambiar la contraseña, se tendrá que volver a iniciar
            sesión.
          </h3>
          <button
            type="submit"
            className="form__submit button-primary change mb-4 max-w-sm"
          >
            Cambiar Contraseña
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

export default NewPassword;
