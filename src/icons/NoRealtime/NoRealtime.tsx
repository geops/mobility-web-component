import type { SVGProps } from "preact/compat";

function NoRealtime(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      height="24"
      viewBox="0 0 42 42"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M40,20A20,20,0,1,1,20,0,20,20,0,0,1,40,20Z"
        data-name="Pfad 1"
        fill="#353535"
        id="Pfad_1"
        transform="translate(0 0)"
      />
      <path
        d="M25.481,11.843a9.993,9.993,0,0,0-10,9.992c0,7.773,10,14.8,10,14.8s9.992-7.5,9.992-14.8a9.991,9.991,0,0,0-9.992-9.992m0,14.662a4.924,4.924,0,1,1,4.924-4.924A4.93,4.93,0,0,1,25.482,26.5"
        data-name="Pfad 2"
        fill="#fff"
        id="Pfad_2"
        transform="translate(-5.477 -4.19)"
      />
      <path
        d="M12.015,8.124,38.081,34.031,35.4,36.536,9.06,10.527Z"
        data-name="Pfad 3"
        fill="#ec0016"
        id="Pfad_3"
        transform="translate(-3.206 -2.874)"
      />
      <path
        d="M20,3.231A16.769,16.769,0,1,1,3.231,20,16.788,16.788,0,0,1,20,3.231M20,0A20,20,0,1,0,40,20,20,20,0,0,0,20,0"
        data-name="Pfad 4"
        fill="#353535"
        id="Pfad_4"
        transform="translate(0 0)"
      />
    </svg>
  );
}

export default NoRealtime;
