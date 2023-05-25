import React, { useEffect, useState } from "react";
import { CForm, CInput } from "@coreui/react";
import { useHistory } from "react-router";

const HeaderSearch: React.FunctionComponent = () => {
  const history = useHistory();
  const queryParams = new URLSearchParams(history.location.search);
  const [keyword, setKeyword] = useState<string>(
    queryParams.get("search") || ""
  );
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (keyword) {
      history.push(`/application/applications?search=${keyword}`);
    } else {
      history.push(`/application/applications`);
    }
  };

  useEffect(() => {
    history.listen((location) => {
      const queryParams = new URLSearchParams(location.search);
      setKeyword(queryParams.get("search") ?? "");
    });
  }, [history]);

  return (
    <CForm
      data-testid="search-form-header"
      method="get"
      onSubmit={handleSubmit}
    >
      <CInput
        name="search"
        value={keyword as string}
        onChange={handleSearch}
        placeholder="Search by name, application ID or mobile number..."
      />
      <button className="search-button-submit" type="submit">
        Submit
      </button>
    </CForm>
  );
};

export default HeaderSearch;
