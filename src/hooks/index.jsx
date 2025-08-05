import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const host = import.meta.env.VITE_API_HOST;

export function useFetchFromAPI(path) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    axios
      .get(`${host}${path}`, {
        withCredentials: true,
        signal: controller.signal,
      })
      .then((resp) => {
        setData(resp.data);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        console.log(err);
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError(err.response?.data?.error || "Something went wrong.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [path, navigate]);

  useEffect(() => {
    const cleanup = fetchData();
    return cleanup;
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

export function useSendMessage(threadId, onSuccess) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const sendMessage = (message) => {
    setIsLoading(true);
    setErrors(null);

    const payload = {
      body: message,
      threadId,
    };

    axios
      .post(`${host}/message`, payload, {
        withCredentials: true,
      })
      .then(() => {
        onSuccess?.();
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 401) {
          navigate("/login");
        } else if (err.response?.status === 400) {
          setErrors(err.response.data.errors);
        } else {
          setErrors([
            { msg: err.response?.data?.error || "Something went wrong." },
          ]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return { sendMessage, isLoading, errors };
}

export function useFindAndGotoThread() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const findAndGotoThread = (userId) => {
    setIsLoading(true);
    setError(null);

    const url = `${host}/thread`;
    const payload = { recipientIds: [userId] };
    axios
      .post(url, payload, {
        withCredentials: true,
      })
      .then((resp) => {
        navigate(`/conversations/${resp.data.thread.id}`);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError(err.response?.data?.error || "Something went wrong.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return { findAndGotoThread, isLoading, error };
}

const initialValues = { search: "", page: 1, resultsPerPage: 10 };
export function useSearch(path) {
  const [search, setSearch] = useState(initialValues.search);
  const [page, setPage] = useState(initialValues.page);
  const [resultsPerPage, setResultsPerPage] = useState(
    initialValues.resultsPerPage,
  );
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchTimeoutRef = useRef(null);
  const abortRef = useRef(null);
  const navigate = useNavigate();

  const fetchSearch = useCallback(
    ({ search, page, resultsPerPage }, onSuccess) => {
      if (abortRef.current) {
        abortRef.current();
        abortRef.current = null;
      }

      const controller = new AbortController();
      abortRef.current = () => controller.abort();

      setIsLoading(true);
      setError(null);

      const url = `${host}${path}/?search=${search}&page=${page}&resultsPerPage=${resultsPerPage}`;
      axios
        .get(url, {
          withCredentials: true,
          signal: controller.signal,
        })
        .then((resp) => {
          setResults(resp.data.results);
          onSuccess?.();
        })
        .catch((err) => {
          if (axios.isCancel(err)) return;
          console.log(err);
          if (err.response?.status === 401) {
            navigate("/login");
          } else {
            setError(err.response?.data?.error || "Something went wrong.");
          }
        })
        .finally(() => {
          setIsLoading(false);
          abortRef.current = null;
        });

      return () => {
        controller.abort();
      };
    },
    [path, navigate],
  );

  useEffect(() => {
    //timeout here so state setters in fetchSearch trigger
    const timeout = setTimeout(() => {
      fetchSearch(initialValues);
    }, 0);

    return () => clearTimeout(timeout);
  }, [fetchSearch]);

  const handleSearchChange = (search) => {
    clearTimeout(fetchTimeoutRef.current);

    const doFetch = () => {
      fetchSearch({ search, page: 1, resultsPerPage }, () => {
        setPage(1);
      });
    };

    setSearch(search);
    fetchTimeoutRef.current = setTimeout(doFetch, 1000);
  };

  const handlePrev = () => {
    if (isLoading) return;
    const prevPage = page - 1;
    fetchSearch({ search, page: prevPage, resultsPerPage }, () =>
      setPage(prevPage),
    );
  };

  const handleNext = () => {
    if (isLoading) return;
    const nextPage = page + 1;
    fetchSearch({ search, page: nextPage, resultsPerPage }, () =>
      setPage(nextPage),
    );
  };

  const handleSetPage = (page) => {
    if (isLoading) return;
    fetchSearch({ search, page, resultsPerPage }, () => setPage(page));
  };

  const handleChangeResultsPerPage = (resultsPerPage) => {
    if (isLoading) return;
    fetchSearch({ search, page: 1, resultsPerPage }, () => {
      (setPage(1), setResultsPerPage(resultsPerPage));
    });
  };

  const queryHandlers = {
    handleSearchChange,
    handlePrev,
    handleNext,
    handleSetPage,
    handleChangeResultsPerPage,
  };

  return {
    search,
    page,
    resultsPerPage,
    results,
    isLoading,
    error,
    queryHandlers,
  };
}

export function useSendUpdate(onSuccess) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const clearErrors = () => {
    setErrors(null);
  };

  const sendUpdate = (path, payload, { multipart = false } = {}) => {
    setIsLoading(true);
    setErrors(null);

    if (multipart) {
      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        const value = payload[key];
        if (value) formData.append(key, value);
      });
      payload = formData;
    }

    axios
      .put(`${host}${path}`, payload, {
        withCredentials: true,
      })
      .then(() => {
        onSuccess?.();
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 401) {
          navigate("/login");
        } else if (err.response?.status === 400) {
          setErrors(err.response.data.errors);
        } else {
          setErrors([
            { msg: err.response?.data?.error || "Something went wrong." },
          ]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return { sendUpdate, clearErrors, isLoading, errors };
}
