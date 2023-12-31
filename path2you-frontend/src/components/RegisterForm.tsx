import { ToastContainer, toast } from "react-toastify";
import { register } from "../core/service";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import fetchApi from "../lib/strapi";

// FALTA:
// 1. Validar username y email que no se repitan

const RegisterForm = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    ) as any;
    setLoading(true);

    try {
      if (
        !data.name ||
        !data.username ||
        !data.email ||
        !data.password ||
        !data.confirmPassword
      ) {
        toast.error("Por favor, ingresa todos los datos.");
        setLoading(false);
        return;
      }

      if (data.password !== data.confirmPassword) {
        toast.error("Las contraseñas no coinciden. Por favor, verifica.");
        setLoading(false);
        return;
      }
      const res = await fetchApi({
        endpoint: "auth/local/register",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: {
          name: data.name,
          username: data.username,
          email: data.email,
          password: data.password,
        },
      });

      if ((res as any)?.error?.status === 400) {
        toast.error("El E-mail o Username ya se encuentra registrado.");
      } else {
        toast.success("Registro Exitoso");
        setTimeout(() => {
          window.location.replace("/login");
        }, 2000);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
    setLoading(false);
  };

  function preventSpaces(event) {
    const input = event.target;
    let value = input.value;

    value = value.replace(/\s/g, "");
    value = value.replace(/[^a-zA-Z0-9]/g, "");

    input.value = value;
  }

  return (
    <section className="register w-full h-full bg-white text-white rounded-lg flex flex-col justify-center items-center max-lg:px-8">
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      )}

      <div className="register__presentation w-fit flex flex-col gap-2 mx-auto text-center">
        <img
          src="/icono.png"
          alt="Logo Path2You"
          className="login__logo max-w-[5rem] mx-auto overflow-hidden"
        />
        <h1 className="login__title text-customPrimary text-2xl md:text-3xl font-bold">
          Creemos tu cuenta.
        </h1>
        <p className="login__text text-customText text-base md:text-lg font-medium">
          Comencemos nuestra aventura.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        method="post"
        autoComplete="off"
        className="form h-fit max-w-sm mt-8"
      >
        <input
          type="text"
          placeholder="Nombre y Apellido"
          aria-label="Nombre y Apellido"
          name="name"
          id="name"
          className="form__input"
          minLength={3}
          required
        />
        <input
          type="text"
          placeholder="Nombre de usuario"
          aria-label="Nombre de Usuario"
          name="username"
          id="username"
          className="form__input"
          onInput={preventSpaces}
          minLength={3}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          aria-label="Correo electrónico"
          name="email"
          id="email"
          className="form__input"
          minLength={6}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          aria-label="Contraseña"
          name="password"
          id="password"
          className="form__input"
          minLength={5}
          required
        />
        <input
          type="password"
          placeholder="Repite la Contraseña"
          aria-label="Repite la Contraseña"
          name="confirmPassword"
          id="confirmPassword"
          className="form__input"
          minLength={5}
          title="La contraseña debe contener al menos una letra."
          required
        />
        <div className="form__submit text-center mt-10">
          <button className="form__button button-primary login mb-4">
            Registrarse
          </button>
          <p className="form__register-redirect text-customText font-medium">
            ¿Ya tienes una cuenta?
            <a
              className="ml-2 underline hover:opacity-80 transition-all duration-300"
              href="/login"
              aria-label="Iniciar Sesión"
            >
              Inicia Sesión
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

export default RegisterForm;
