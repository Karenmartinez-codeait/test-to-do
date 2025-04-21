import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { getTodos } from '../../api/todos';

interface FormValues {
  text: string;
}

interface Todo {
  id: number;
  text: string;
}

const TodoList = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { register, handleSubmit, reset } = useForm<FormValues>();

  const { data, error, isLoading } = useQuery<Todo[]>({
    queryKey: ['todos', page],
    queryFn: () => getTodos(page),
  });

  const handleCreate = (data) => {
    if (data.text) {
      const created = { id: Date.now(), text: data.text };

      queryClient.setQueryData<Todo[]>(['todos', page], (old = []) => [
        ...old,
        created,
      ]);
    }

    reset();
  };

  const handleModify = (id, newText) => {
    queryClient.setQueryData<Todo[]>(['todos', page], (oldData = []) =>
      oldData.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  const handleRemove = (id: number) => {
    queryClient.setQueryData<Todo[]>(['todos', page], (oldData = []) =>
      oldData.filter((todo) => todo.id !== id)
    );
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Stack spacing={2}>
      <Typography>To Do List Challenge</Typography>

      <Box component="form" onSubmit={handleSubmit(handleCreate)}>
        <Stack direction="row" spacing={2}>
          <TextField {...register('text')} fullWidth label="todo" />
          <Button type="submit" variant="contained">
            Add
          </Button>
        </Stack>
      </Box>

      <Stack direction="column" spacing={2}>
        {/* List */}
        {data?.map((todo) => (
          <Stack direction="row" key={todo.id} alignItems="center">
            <Typography>{todo.text}</Typography>

            <IconButton
              onClick={() =>
                handleModify(
                  todo.id,
                  prompt('Edit todo', todo.text) || todo.text
                )
              }
            >
              <EditIcon />
            </IconButton>

            <IconButton onClick={() => handleRemove(todo.id)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}
      </Stack>

      <Stack direction="row" spacing={2}>
        {/* Pagination */}
        <Button onClick={() => setPage(page - 1)}>Previous</Button>
        <Button onClick={() => setPage(page + 1)}>Next</Button>
      </Stack>
    </Stack>
  );
};

export { TodoList };
