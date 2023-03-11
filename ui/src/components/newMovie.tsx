import axios from "axios";
import _ from "lodash";
import { useEffect, useState } from "react";
import { FieldError, useForm, UseFormRegisterReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Genre, getMovies, Movie } from "../fakeBackend";

type FormValues = {
  name: string;
  genre: string;
  stock: number;
  rate: number;
};

function ErrorField(props: {
  label: string;
  placeholder?: string;
  error?: FieldError;
  inputs: UseFormRegisterReturn;
}) {
  return (
    <div className="form-group">
      <label htmlFor={props.inputs.name}>{props.label}</label>
      <input
        className="form-control"
        {...props.inputs}
        placeholder={props.placeholder}
      />
      {props.error && (
        <div className="alert alert-danger">{props.error.message}</div>
      )}{" "}
    </div>
  );
}

function NewMovie() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onChange" });
  const navigate = useNavigate();
  const [state, updateState] = useState({
    genres: [] as Array<Genre>,
  });

  var movies = getMovies();
  useEffect(() => {
    // Fetch the data
    (async () => {
      const genres = (await axios.get("/genres/")).data;
      console.log(genres);
      updateState((s) => {
        return {
          ...state,
          genres: genres,
        };
      });
    })();
    // eslint-disable-next-line
  }, []);

  const onSubmit = handleSubmit((data: FormValues) => {
    const movie: Movie = {
      id: String(movies.length + 1),
      title: data.name,
      genre: genres.find((g) => g.id === data.genre) || {
        id: "-1",
        name: "Unknown",
      },
      numberInStock: data.stock,
      dailyRentalRate: data.rate,
      publishDate: "unknown",
      liked: false,
    };

    // Calling the backend service
    console.log(movie);
    movies.push(movie);
    navigate("/", { replace: true });
  });

  return (
    <div>
      <h1>Add a new movie</h1>
      <form onSubmit={onSubmit}>
        <ErrorField
          label={"Movie Name"}
          placeholder="The shining"
          error={errors["name"]}
          inputs={register("name", {
            required: "Movie name is required",
          })}
        />

        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <select className="form-control" id="genre" {...register("genre")}>
            <option value=" " />
            {genres.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <ErrorField
          label={"Number in stock"}
          placeholder="1"
          error={errors["stock"]}
          inputs={register("stock", {
            required: "Number in stock is required",
            validate: (val: number) => {
              if (val < 0 || val >= 100)
                return "Number in stock should be between 0, 100";
            },
          })}
        />

        <ErrorField
          label={"Rate"}
          placeholder="1"
          error={errors["rate"]}
          inputs={register("rate", {
            required: "Number in stock is required",
            validate: (val: number) => {
              if (val < 0 || val >= 5) return "Rate should be between 0, 5";
            },
          })}
        />

        <button disabled={!_.isEmpty(errors)} className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewMovie;
