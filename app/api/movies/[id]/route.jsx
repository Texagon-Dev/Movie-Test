import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// GET /api/movies/[id]
export async function GET(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id } = params;

  try {
    const { data: movie, error } = await supabase
      .from("movies")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (movie?.poster_url) {
      const fileName = movie.poster_url.split("/").pop();
      const { data } = await supabase.storage
        .from("movie_posters")
        .createSignedUrl(fileName, 604800);
      movie.poster_url = data?.signedUrl || movie.poster_url;
    }

    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/movies/[id]
export async function PATCH(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id } = params;

  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const publishing_year = formData.get("publishing_year");
    const poster = formData.get("poster");

    const updateData = {
      title,
      publishing_year: parseInt(publishing_year),
    };

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

      updateData.poster_url = fileName;
    }

    const { data: movie, error } = await supabase
      .from("movies")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (movie?.poster_url) {
      const { data } = await supabase.storage
        .from("movie_posters")
        .createSignedUrl(movie.poster_url, 604800);
      movie.poster_url = data?.signedUrl || movie.poster_url;
    }

    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/movies/[id]
export async function DELETE(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id } = params;

  try {
    const { data: movie } = await supabase
      .from("movies")
      .select("poster_url")
      .eq("id", id)
      .single();

    if (movie?.poster_url) {
      await supabase.storage.from("movie_posters").remove([movie.poster_url]);
    }

    const { error } = await supabase.from("movies").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
