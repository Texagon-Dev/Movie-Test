import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function getSignedUrl(supabase, fileName) {
  try {
    const { data } = await supabase.storage
      .from("movie_posters")
      .createSignedUrl(fileName, 604800);
    return data?.signedUrl;
  } catch (error) {
    console.error(`Error getting signed URL for ${fileName}:`, error);
    return null;
  }
}

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 8;
  const offset = (page - 1) * limit;

  try {
    const [countResult, moviesResult] = await Promise.all([
      supabase.from("movies").select("*", { count: "exact", head: true }),
      supabase
        .from("movies")
        .select("*")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1),
    ]);

    const { count } = countResult;
    const { data: movies, error } = moviesResult;
    if (error) throw error;

    if (movies) {
      const signedUrlPromises = movies
        .filter((movie) => movie.poster_url)
        .map((movie) => {
          const fileName = movie.poster_url.split("/").pop();
          return getSignedUrl(supabase, fileName).then((signedUrl) => ({
            movieId: movie.id,
            signedUrl,
          }));
        });

      const signedUrls = await Promise.all(signedUrlPromises);

      signedUrls.forEach(({ movieId, signedUrl }) => {
        const movie = movies.find((m) => m.id === movieId);
        if (movie && signedUrl) {
          movie.poster_url = signedUrl;
        }
      });
    }

    return NextResponse.json({
      movies,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalMovies: count,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const publishing_year = formData.get("publishing_year");
    const poster = formData.get("poster");

    let poster_url = null;
    if (poster && poster.size > 0) {
      const fileExt = poster.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("movie_posters")
        .upload(fileName, poster, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = await supabase.storage
        .from("movie_posters")
        .createSignedUrl(fileName, 604800);

      poster_url = fileName;
    }

    const { data: movie, error } = await supabase
      .from("movies")
      .insert([
        {
          title,
          publishing_year: parseInt(publishing_year),
          poster_url,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
