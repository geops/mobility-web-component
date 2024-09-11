const useParams = () => {
  return Object.fromEntries(new URLSearchParams(window.location.search));
};

export default useParams;
