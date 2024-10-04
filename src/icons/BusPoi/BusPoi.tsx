function BusPoi(props) {
  return (
    <svg
      height="28.8"
      viewBox="0 0 28.8 28.8"
      width="28.8"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="14.4"
        cy="14.4"
        fill="#5c798f"
        r="14.4"
        transform="translate(0 0)"
      />
      <path
        d="M5.5,7.066V18.56a.528.528,0,0,0,.528.528H7.217v1.717c0,.132,0,.264.132.264H8.671a.264.264,0,0,0,.264-.264V19.088H16.2v1.585a.264.264,0,0,0,.264.264h1.321c.132,0,.132-.132.132-.264V19.22h1.321a.661.661,0,0,0,.528-.661V7.066C19.768,4.027,5.5,3.9,5.5,7.066Zm9.776-1.057V7.33H9.992V6.009Zm-7,12.022a1.125,1.125,0,1,1,1.058-1.123A1.125,1.125,0,0,1,8.276,18.031Zm8.719,0a1.125,1.125,0,1,1,1.057-1.189A1.189,1.189,0,0,1,16.995,18.031Zm1.057-3.3H7.085V9.708A1.057,1.057,0,0,1,8.142,8.651h8.851A1.057,1.057,0,0,1,18.05,9.708Z"
        fill="#fff"
        transform="translate(1.766 1.521)"
      />
    </svg>
  );
}

export default BusPoi;