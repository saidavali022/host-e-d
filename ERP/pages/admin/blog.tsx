import NextLink from "next/link";
// material
import { Box, Grid, Button, Container, Stack, Typography } from "@mui/material";
// components
import Page from "@components/Page";
import Iconify from "@components/Iconify";
import {
  BlogPostCard,
  BlogPostsSort,
  BlogPostsSearch,
} from "@sections/dashboard/blog";
//
import POSTS from "@_mocks_/blog";

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "oldest", label: "Oldest" },
];

// ----------------------------------------------------------------------

export default function Blog() {
  return (
    <>
      <Box>
        <Container>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Typography variant="h4" gutterBottom>
              Blog
            </Typography>
            <NextLink href="#">
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                New Post
              </Button>
            </NextLink>
          </Stack>

          <Stack
            mb={5}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <BlogPostsSearch posts={POSTS} />
            <BlogPostsSort options={SORT_OPTIONS} />
          </Stack>

          <Grid container spacing={3}>
            {POSTS.map((post, index) => (
              <BlogPostCard key={post.id} post={post} index={index} />
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
