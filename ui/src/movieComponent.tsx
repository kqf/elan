import { useNavigate, useParams } from "react-router-dom";

type MovieParams = {
  id: string;
};

export default function MovieComponent() {
  const params = useParams<MovieParams>();
  const navigate = useNavigate();
  return (
    <div>
      <h1>This is movie {params.id}</h1>
      <button
        className="btn btn-primary"
        onClick={() => navigate("/", { replace: true })}
      >
        Save
      </button>
    </div>
  );
}
