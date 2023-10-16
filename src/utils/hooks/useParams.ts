const useParams = () => {
  const params = new URLSearchParams(window.location.search);
  // @ts-ignore
  return Object.fromEntries(new URLSearchParams(window.location.search));
};

export default useParams;
