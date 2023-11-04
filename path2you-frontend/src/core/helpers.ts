export const storeUser = (data) => {
  localStorage.setItem(
    "user",
    JSON.stringify({
      id: data.user.id,
      username: data.user.username,
      darkmode: data.user.darkmode,
      neumorphismmode: data.user.neumorphismmode,
      jwt: data.jwt,
    })
  );
};

export const userData = () => {
  const strUser = localStorage.getItem("user") || '""';
  return JSON.parse(strUser);
};

export function formatDate(fechaISO) {
  return new Date(fechaISO).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

// export const Protector = () => {

//   useEffect(() => {
//     const { jwt } = userData();

//     if (!jwt) {
//       location.replace("/");
//     }
//   }, []);

// };