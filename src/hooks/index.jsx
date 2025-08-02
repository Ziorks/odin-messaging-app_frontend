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
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const sendMessage = (message) => {
    setIsLoading(true);
    setError(null);

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
        } else {
          setError(err.response?.data?.error || "Something went wrong.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return { sendMessage, isLoading, error };
}

export function useFindAndGotoThread() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const findAndGotoThread = (userId) => {
    setIsLoading(true);
    setError(null);

    const url = `${host}/thread/find-or-create`;
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

export function useSearch(path) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchTimeoutRef = useRef(null);
  const abortRef = useRef(null);
  const prevSearchRef = useRef(search);
  const navigate = useNavigate();

  const fetchSearch = useCallback(
    ({ search, page, resultsPerPage }) => {
      const controller = new AbortController();
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
    },
    [path, navigate],
  );

  useEffect(() => {
    const doAbort = () => {
      clearTimeout(fetchTimeoutRef.current);
      if (abortRef.current) {
        abortRef.current();
        abortRef.current = null;
      }
    };

    const doFetch = () => {
      const cleanup = fetchSearch({ search, page, resultsPerPage });
      abortRef.current = cleanup;
      prevSearchRef.current = search;
    };

    doAbort();

    if (prevSearchRef.current !== search) {
      fetchTimeoutRef.current = setTimeout(doFetch, 1000);
    } else {
      doFetch();
    }

    return doAbort;
  }, [fetchSearch, search, page, resultsPerPage]);

  const handleSearchChange = (search) => {
    setSearch(search);
    setPage(1);
  };

  const handlePrev = () => {
    setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    setPage((prev) => prev + 1);
  };

  const handleSetPage = (page) => {
    setPage(page);
  };

  const handleChangeResultsPerPage = (resultsPerPage) => {
    setPage(1);
    setResultsPerPage(resultsPerPage);
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
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const sendUpdate = (path, payload, { multipart = false } = {}) => {
    setIsLoading(true);
    setError(null);

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
        } else {
          setError(err.response?.data?.error || "Something went wrong.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return { sendUpdate, isLoading, error };
}
