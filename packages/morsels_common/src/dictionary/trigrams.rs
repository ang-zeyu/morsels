#[inline(always)]
pub fn get_tri_grams(term: &str) -> impl Iterator<Item = &str> {
    let chars = term.char_indices();

    chars
        .enumerate()
        .scan((0, 0), move |acc, idx_and_charindex| {
            let char_idx = idx_and_charindex.1 .0;
            if idx_and_charindex.0 < 2 {
                if idx_and_charindex.0 == 1 {
                    acc.1 = char_idx;
                }

                Some("")
            } else {
                let ret = Some(&term[acc.0..char_idx + idx_and_charindex.1 .1.len_utf8()]);
                acc.0 = acc.1;
                acc.1 = char_idx;

                ret
            }
        })
        .skip(2)
}

#[cfg(test)]
mod test {
    use super::get_tri_grams;

    #[test]
    fn test_trigram_extraction() {
        assert!(get_tri_grams("").next().is_none());
        assert!(get_tri_grams("foo").eq(vec!["foo"]));
        assert!(get_tri_grams("foobar").eq(vec!["foo", "oob", "oba", "bar"]));
    }
}
