import { useState } from "react";
import { logIn } from "../core/service";
import { storeUser } from "../core/helpers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fetchApi from "../lib/strapi";

const initialUser = { identifier: "", password: "" };

const LoginForm = () => {
  const [user, setUser] = useState(initialUser);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    ) as any;

    try {
      if (!data.identifier || !data.password) {
        throw new Error("Por favor, ingresa todos los datos.");
      }

      const res = await fetchApi({
        endpoint: "auth/local",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: {
          identifier: data.identifier,
          password: data.password,
        },
      });

      const { jwt, user } = res as any;

      if ((res as any)?.error?.status === 400) {
        toast.error("E-mail o contraseña inválidos.");
        return;
      } else if (jwt) {
        toast.success("Inicio de Sesion Exitoso");
        storeUser(res);
        setUser(initialUser);
        location.replace("/");
      } else {
        toast.error((res as any).data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <section className="login w-full h-full bg-white text-white rounded-lg flex flex-col justify-center items-center max-lg:px-8">
      <div className="login__presentation w-fit flex flex-col gap-2 mx-auto text-center">
        <img
          src="/icono.png"
          alt="Logo Path2You"
          className="login__logo max-w-[5rem] mx-auto overflow-hidden"
        />
        <h1 className="login__title text-customPrimary text-2xl md:text-3xl font-bold">
          ¡Bienvenido de vuelta!
        </h1>
        <p className="login__text text-customText text-base md:text-lg font-medium">
          Por favor, ingresa tus datos.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        method="post"
        autoComplete="on"
        className="form h-fit max-w-sm mt-16"
      >
        <input
          type="email"
          placeholder="Correo electrónico"
          aria-label="Correo electrónico"
          name="identifier"
          id="identifier"
          className="form__input"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          aria-label="Contraseña"
          name="password"
          id="password"
          className="form__input"
          required
        />
        <div className="form__submit text-center mt-10">
          <button className="form__button button-primary login mb-4">
            Iniciar Sesión
          </button>
          <p className="form__register-redirect text-customText font-medium">
            ¿No tienes una cuenta?
            <a
              className="ml-2 underline hover:opacity-80 transition-all duration-300"
              href="/register"
              aria-label="Registrarse"
            >
              Regístrate
            </a>
          </p>
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

export default LoginForm;
