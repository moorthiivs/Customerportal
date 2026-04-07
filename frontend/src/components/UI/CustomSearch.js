import "./CustomSearch.css";
import { useState, useEffect } from "react";
import CustomInput from "./CustomInput";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  filterbyName,
  filterbyidno,
  filterbymake,
  filterbymodel,
  filterbyserialno,
  filterbysrfNo,
} from "../../utils/filters";
const CustomSearch = (props) => {
  const [state, setState] = useState({ options: null });
  useEffect(() => {
    setState({ options: props.options });
  }, [props.options]);
  useEffect(() => {
    props.onfilter(state.options);
  }, [state]);

  function filter(query, options, filterby) {
    if (query) {
      if (filterby === "name") {
        return filterbyName(query, options);
      } else if (filterby === "make") {
        return filterbymake(query, options);
      } else if (filterby === "model") {
        return filterbymodel(query, options);
      } else if (filterby === "serialno") {
        return filterbyserialno(query, options);
      } else if (filterby === "idno") {
        return filterbyidno(query, options);
      } else if (filterby === "srfNo") {
        return filterbysrfNo(query, options);
      }
    }
  }

  function search(value) {
    if (state.options && state.value && value.length > state.value.length) {
      setState({
        options: filter(value, state.options, props.filterby),
        value,
      });
    } else if (value) {
      setState({
        value,
      });
      setState({
        options: filter(value, props.options, props.filterby),
        value,
      });
    } else {
      setState({
        value: "",
        options: null,
      });
    }
  }
  return (
    <div className="custom__search__container">
      <CustomInput
        label={props.label}
        type="text"
        onchange={(v) => search(v)}
        disabled={false}
        icon={
          <FontAwesomeIcon icon={faSearch} className="rainbow-color_gray-3" />
        }
        iconPosition="right"
      />
    </div>
  );
};

export default CustomSearch;
