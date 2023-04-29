create function public.get_article_list(tag_name text default null)
returns table(
  id bigint,
  title text,
  slug text,
  profile jsonb,
  tags jsonb
)
language plpgsql
as $$
begin
  return query
  select
    articles.id,
    articles.title,
    articles.slug,
    jsonb_build_object(
      'username', profiles.username,
      'first_name', profiles.first_name,
      'last_name', profiles.last_name
    ) as profile,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', tags.id,
          'name', tags.name
        )
      ) filter (where tags.id is not null),
      '[]'
    ) as tags
  from
    articles
    inner join profiles on articles.user_id = profiles.id
    left join articles_tags on articles.id = articles_tags.article_id
    left join tags on articles_tags.tag_id = tags.id
  where
    case
      when tag_name is not null then
        articles.id in (
          select
            article_id
          from
            articles_tags
            left join tags on articles_tags.tag_id = tags.id
          where
            tags.name = tag_name
        )
      else
        true
    end
  group by
    articles.id,
    profiles.id;
end;
$$;
