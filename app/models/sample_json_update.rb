class SampleJsonUpdate < JsonUpdate
  sort_order :sample_name, :patient, :headshot, :fingerprint, :qc

  def update
    patch_attribute(:notes) {|a| a.attribute_class = "TextAttribute"}
    patch_attribute(:weight) {|a| a.placeholder = "Mass in grams"}
    patch_attribute(:post_digest_cell_count) {|a| a.placeholder = "Integer count, e.g. 2000 or 200_000"}
  end
end


